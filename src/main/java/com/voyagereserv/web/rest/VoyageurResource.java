package com.voyagereserv.web.rest;

import com.voyagereserv.domain.Voyageur;
import com.voyagereserv.repository.VoyageurRepository;
import com.voyagereserv.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.voyagereserv.domain.Voyageur}.
 */
@RestController
@RequestMapping("/api/voyageurs")
@Transactional
public class VoyageurResource {

    private final Logger log = LoggerFactory.getLogger(VoyageurResource.class);

    private static final String ENTITY_NAME = "voyageur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VoyageurRepository voyageurRepository;

    public VoyageurResource(VoyageurRepository voyageurRepository) {
        this.voyageurRepository = voyageurRepository;
    }

    /**
     * {@code POST  /voyageurs} : Create a new voyageur.
     *
     * @param voyageur the voyageur to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new voyageur, or with status {@code 400 (Bad Request)} if the voyageur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Voyageur> createVoyageur(@RequestBody Voyageur voyageur) throws URISyntaxException {
        log.debug("REST request to save Voyageur : {}", voyageur);
        if (voyageur.getId() != null) {
            throw new BadRequestAlertException("A new voyageur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Voyageur result = voyageurRepository.save(voyageur);
        return ResponseEntity
            .created(new URI("/api/voyageurs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /voyageurs/:id} : Updates an existing voyageur.
     *
     * @param id the id of the voyageur to save.
     * @param voyageur the voyageur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voyageur,
     * or with status {@code 400 (Bad Request)} if the voyageur is not valid,
     * or with status {@code 500 (Internal Server Error)} if the voyageur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Voyageur> updateVoyageur(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Voyageur voyageur
    ) throws URISyntaxException {
        log.debug("REST request to update Voyageur : {}, {}", id, voyageur);
        if (voyageur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voyageur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voyageurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Voyageur result = voyageurRepository.save(voyageur);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, voyageur.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /voyageurs/:id} : Partial updates given fields of an existing voyageur, field will ignore if it is null
     *
     * @param id the id of the voyageur to save.
     * @param voyageur the voyageur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voyageur,
     * or with status {@code 400 (Bad Request)} if the voyageur is not valid,
     * or with status {@code 404 (Not Found)} if the voyageur is not found,
     * or with status {@code 500 (Internal Server Error)} if the voyageur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Voyageur> partialUpdateVoyageur(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Voyageur voyageur
    ) throws URISyntaxException {
        log.debug("REST request to partial update Voyageur partially : {}, {}", id, voyageur);
        if (voyageur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voyageur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voyageurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Voyageur> result = voyageurRepository
            .findById(voyageur.getId())
            .map(existingVoyageur -> {
                if (voyageur.getNom() != null) {
                    existingVoyageur.setNom(voyageur.getNom());
                }
                if (voyageur.getEmail() != null) {
                    existingVoyageur.setEmail(voyageur.getEmail());
                }
                if (voyageur.getMotDePasse() != null) {
                    existingVoyageur.setMotDePasse(voyageur.getMotDePasse());
                }

                return existingVoyageur;
            })
            .map(voyageurRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, voyageur.getId().toString())
        );
    }

    /**
     * {@code GET  /voyageurs} : get all the voyageurs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of voyageurs in body.
     */
    @GetMapping("")
    public List<Voyageur> getAllVoyageurs() {
        log.debug("REST request to get all Voyageurs");
        return voyageurRepository.findAll();
    }

    /**
     * {@code GET  /voyageurs/:id} : get the "id" voyageur.
     *
     * @param id the id of the voyageur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the voyageur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Voyageur> getVoyageur(@PathVariable("id") Long id) {
        log.debug("REST request to get Voyageur : {}", id);
        Optional<Voyageur> voyageur = voyageurRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(voyageur);
    }

    /**
     * {@code DELETE  /voyageurs/:id} : delete the "id" voyageur.
     *
     * @param id the id of the voyageur to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoyageur(@PathVariable("id") Long id) {
        log.debug("REST request to delete Voyageur : {}", id);
        voyageurRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

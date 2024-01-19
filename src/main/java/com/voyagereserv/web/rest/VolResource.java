package com.voyagereserv.web.rest;

import com.voyagereserv.domain.Vol;
import com.voyagereserv.repository.VolRepository;
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
 * REST controller for managing {@link com.voyagereserv.domain.Vol}.
 */
@RestController
@RequestMapping("/api/vols")
@Transactional
public class VolResource {

    private final Logger log = LoggerFactory.getLogger(VolResource.class);

    private static final String ENTITY_NAME = "vol";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VolRepository volRepository;

    public VolResource(VolRepository volRepository) {
        this.volRepository = volRepository;
    }

    /**
     * {@code POST  /vols} : Create a new vol.
     *
     * @param vol the vol to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vol, or with status {@code 400 (Bad Request)} if the vol has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Vol> createVol(@RequestBody Vol vol) throws URISyntaxException {
        log.debug("REST request to save Vol : {}", vol);
        if (vol.getId() != null) {
            throw new BadRequestAlertException("A new vol cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vol result = volRepository.save(vol);
        return ResponseEntity
            .created(new URI("/api/vols/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vols/:id} : Updates an existing vol.
     *
     * @param id the id of the vol to save.
     * @param vol the vol to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vol,
     * or with status {@code 400 (Bad Request)} if the vol is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vol couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Vol> updateVol(@PathVariable(value = "id", required = false) final Long id, @RequestBody Vol vol)
        throws URISyntaxException {
        log.debug("REST request to update Vol : {}, {}", id, vol);
        if (vol.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vol.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!volRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vol result = volRepository.save(vol);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, vol.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vols/:id} : Partial updates given fields of an existing vol, field will ignore if it is null
     *
     * @param id the id of the vol to save.
     * @param vol the vol to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vol,
     * or with status {@code 400 (Bad Request)} if the vol is not valid,
     * or with status {@code 404 (Not Found)} if the vol is not found,
     * or with status {@code 500 (Internal Server Error)} if the vol couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Vol> partialUpdateVol(@PathVariable(value = "id", required = false) final Long id, @RequestBody Vol vol)
        throws URISyntaxException {
        log.debug("REST request to partial update Vol partially : {}, {}", id, vol);
        if (vol.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vol.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!volRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vol> result = volRepository
            .findById(vol.getId())
            .map(existingVol -> {
                if (vol.getCompagnie() != null) {
                    existingVol.setCompagnie(vol.getCompagnie());
                }
                if (vol.getHoraire() != null) {
                    existingVol.setHoraire(vol.getHoraire());
                }
                if (vol.getTarif() != null) {
                    existingVol.setTarif(vol.getTarif());
                }
                if (vol.getSiegesDisponibles() != null) {
                    existingVol.setSiegesDisponibles(vol.getSiegesDisponibles());
                }

                return existingVol;
            })
            .map(volRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, vol.getId().toString())
        );
    }

    /**
     * {@code GET  /vols} : get all the vols.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vols in body.
     */
    @GetMapping("")
    public List<Vol> getAllVols() {
        log.debug("REST request to get all Vols");
        return volRepository.findAll();
    }

    /**
     * {@code GET  /vols/:id} : get the "id" vol.
     *
     * @param id the id of the vol to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vol, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Vol> getVol(@PathVariable("id") Long id) {
        log.debug("REST request to get Vol : {}", id);
        Optional<Vol> vol = volRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(vol);
    }

    /**
     * {@code DELETE  /vols/:id} : delete the "id" vol.
     *
     * @param id the id of the vol to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVol(@PathVariable("id") Long id) {
        log.debug("REST request to delete Vol : {}", id);
        volRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
